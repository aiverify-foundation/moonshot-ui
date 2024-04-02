type RougeDetailCellProps = {
  data: {
    [key: string]: Record<string, number>;
  };
};

function RougeDetailCell(props: RougeDetailCellProps) {
  const { data } = props;
  return (
    <div className="flex flex-col divide-y divide-gray-400">
      {Object.entries(data).map(([key, value]) => (
        <div
          key={key}
          className="flex flex-col pt-2">
          <div>{key}:</div>
          {Object.entries(value).map(([subKey, subValue]) => (
            <div
              key={subKey}
              className="flex gap-2 w-full">
              <div>{subKey}:</div>
              <div className="text-blue-700 font-bold">
                {subValue.toFixed(4)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export { RougeDetailCell };
