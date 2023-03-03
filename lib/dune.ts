import axios from 'axios';
import { hash } from 'object-code';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const ttl = 1000 * 60 * 60 //ms, default = 60 minute.
const alertTTL = 1000 * 60 * 5 //ms, default = 5 minute.

// Add a request interceptor ?
// Add a response interceptor ?

const instance = axios.create({
  baseURL: 'https://api.dune.com/api/v1/',
  headers: {'x-dune-api-key': process.env.NEXT_PUBLIC_X_DUNE_API_KEY},
});

export const executeQuery = async (id: string, parameters: any) => {
  const result = { data: { execution_id: '', state: '' }, error: '', cache: false };
  const key = hash({ id, parameters, source: 'dune-execute-query' });
  try {
    const current = new Date();
    current.setTime(current.getTime() - ((id == '2056547') ? alertTTL : ttl));

    const dQuery = await prisma.duneQuery.findFirst({
      where: {
        id: BigInt(key),
        createdAt: { gte: current },
      },
    });
    if (dQuery) {
      result.cache = true;
      result.data = { 'execution_id': dQuery.execution_id, 'state': ''};
    } else {
      const { data } = await instance.post(`/query/${id}/execute`, parameters);
      await prisma.duneQuery.create({
        data: { id: BigInt(key), query_id: Number(id), execution_id: data.execution_id },
      })
      result.data = data;
    }
  } catch(e) {
    console.log(e);
    result.error = `Error executing dune query ID: ${id}`;
  }
  return result;
};

export const executeStatus = async (id: string) => {
  const result = {data: { execution_id: id, state: '' }, error: ''};
  try {
    const { data } = await instance.get(`/execution/${id}/status`);
    result.data = data;
  } catch(e) {
    console.log(e);
    result.error = `Error executing dune status: ${id}`;
  }
  return result;
};

export const executeResults = async (id: string, ) => {
  const result = { data: { execution_id: id, state: '' }, error: '' };
  try {
    const { data } = await instance.get(`/execution/${id}/results`);
    result.data = data;
  } catch(e) {
    console.log(e);
    result.error = `Error executing dune result: ${id}`;
  }
  return result;
};
