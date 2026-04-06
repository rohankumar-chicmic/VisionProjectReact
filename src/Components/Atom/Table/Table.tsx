import React from 'react';
import './Table.scss';

export interface Column<T> {
  header: React.ReactNode;
  accessor: keyof T | ((item: T) => React.ReactNode);
  width?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

function Table<T>({
  columns,
  data,
  onRowClick,
  isLoading,
}: Readonly<TableProps<T>>) {
  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            style={{ textAlign: 'center', padding: '2rem' }}
          >
            <div className="table-loader">Loading...</div>
          </td>
        </tr>
      );
    }

    if (data.length === 0) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            style={{ textAlign: 'center', padding: '2rem' }}
          >
            No data found
          </td>
        </tr>
      );
    }

    return data.map((item, rowIndex) => (
      <tr
        key={(item as any).id || rowIndex}
        onClick={() => onRowClick?.(item)}
        className={onRowClick ? 'clickable' : ''}
      >
        {columns.map((column, colIndex) => (
          <td key={`${rowIndex}-${colIndex}`}>
            {typeof column.accessor === 'function'
              ? column.accessor(item)
              : (item[column.accessor] as React.ReactNode)}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} style={{ width: column.width }}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </table>
    </div>
  );
}

export default Table;
