'use client'

import TableAlertItemSkeleton from "./TableAlertItemSkeleton";




interface Props {
    size: number;
    isLoading: boolean;
}

export default function TableSkeleton({ size, isLoading }: Props) {


    return (
        <>
        {isLoading ? (
             <>
             {Array(10).fill(null).map((_item, index)=>(
                 <TableAlertItemSkeleton 
                    key={`skeleton_key_${index}`} 
                    size={size}
                />
             ))}
             </>
           ) : null}
           </>
    )
}