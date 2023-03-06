
import moment from 'moment';

export type AlertListProps = {
  list: any[];
  timestamp: number;
}

export default ({ list, timestamp }: AlertListProps) => {
  let title = "Alert On " + moment(timestamp).format('YYYY-MM-DD hh:mm:ss');
  return (
    <div className="">
      <h3 className="py-2 text-gray-600 font-bold">{title}</h3>
      <table className="w-full border-collapse border border-gray-300 bg-white table-fixed text-sm">
        <thead>
          <tr className="border border-gray-400 bg-gray-400 capitalize text-white">
            <th className="text-left font-normal w-2/12 pl-2 py-2">block_time</th>
            <th className="text-left font-normal w-1/12">amount_usd</th>
            <th className="text-left font-normal w-1/12">token_pair</th>
            <th className="text-left font-normal w-3/12">taker</th>
            <th className="text-left font-normal w-2/12">tx_hash</th>
            <th className="text-left font-normal w-3/12">project_contract_address</th>
          </tr>
        </thead>
        <tbody>
          {(list ?? []).map((item, i) => (
            <tr className={i % 2 == 0 ? "" : "bg-gray-200"} key={`alert${timestamp}${i}`}>
              <td className="pl-2 py-2">{moment(item.block_time).format("YYYY-MM-DD hh:mm")}</td>
              <td className="">{item.amount_usd.toFixed(2)}</td>
              <td className="">{item.token_pair}</td>
              <td className="truncate">{item.taker}</td>
              <td className="truncate">{item.tx_hash}</td>
              <td className="truncate">{item.project_contract_address}</td>
            </tr>
          ))}
          {
            (!list || !list.length) && (
              <tr>
                <td colSpan={6} className="italic font-light text-center py-6">
                  No Data!
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  )
}
