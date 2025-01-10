'use client';
import DataTable from "@/components/data-table"

import { useColumns } from "@/components/lulus/columns";


const Lulus = () => {
    const { columns } = useColumns(false);

  return (
     <DataTable
        rows={ []}
        columns={columns}
        columnIdFilter="aniversariantenome"
      />  )
}

export default Lulus
