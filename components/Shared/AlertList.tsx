
import moment from 'moment';

export type AlertListProps = {
  list: any[];
  timestamp: number;
}

export default ({ list, timestamp }: AlertListProps) => {
  let title = "Alert On " + moment(timestamp).format('YYYY-MM-DD hh:mm:ss');
  return (
    <div className="">
      <h3 className="py-2 font-bold">{title}</h3>
      <table className="w-full table-fixed border-collapse border border-gray-300 text-xs">
        <thead>
          <tr className="border border-gray-300 bg-gray-200 capitalize">
            <th className="text-left font-normal w-1/12 pl-4 py-2">block_time</th>
            <th className="text-left font-normal w-1/12">amount_usd</th>
            <th className="text-left font-normal w-1/12">token_pair</th>
            <th className="text-left font-normal w-3/12">taker</th>
            <th className="text-left font-normal w-2/12">tx_hash</th>
            <th className="text-left font-normal w-4/12">project_contract_address</th>
          </tr>
        </thead>
        <tbody>
          {(list ?? []).map((item, i) => (
            <tr className={i % 2 == 0 ? "" : "bg-gray-100"} key={`alert${timestamp}${i}`}>
              <td className="pl-4 py-2">{moment(item.block_time).format("YYYY-MM-DD hh:mm")}</td>
              <td className="">{item.amount_usd.toFixed(2)}</td>
              <td className="">{item.token_pair}</td>
              <td className="">{item.taker}</td>
              <td className="truncate">{item.tx_hash}</td>
              <td className="">{item.project_contract_address}</td>
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
