import type { NextApiRequest, NextApiResponse } from 'next'
import { executeQuery, executeResults } from '@lib/dune'

const queryList = [2056212, 2056310, 2056547, 1258228];

type Data = {
  data: any,
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query, blockchain, start_datetime, current_hour, pool, current_hour_minute, trade_amount_usd } = req.query;
  if (!queryList.includes(Number(query))) {
    return res.status(400).json({data: {}, error: 'Error query ID'});
  }

  let parameters = { query_parameters: {} };
  switch (query) {
    case '2056212':
      parameters.query_parameters = { blockchain, start_datetime };
      break;
    case '2056310':
      parameters.query_parameters = { blockchain, current_hour, pool };
      break;
    case '2056547':
      parameters.query_parameters = { blockchain, current_hour_minute, pool, trade_amount_usd };
      break;
    default:
      parameters.query_parameters = req.query;
  }
  const queryData = await executeQuery(String(query), parameters);
  if (queryData?.error === '') {
    const resultData = await executeResults(String(queryData.data.execution_id));
    return res.status(200).json(resultData);
  }
  return res.status(400).json(queryData);
}
