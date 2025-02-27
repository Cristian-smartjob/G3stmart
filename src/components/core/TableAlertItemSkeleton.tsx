'use client'

interface Props {
    size?: number;
}

export default function TableAlertItemSkeleton({ size = 6 }: Props){

  
    return (
       <>
      
        <tr 
        className="border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition"  
        id="table-column-header-0" 
        data-accordion-target="#table-column-body-0"
        aria-expanded="false" aria-controls="table-column-body-0"
         >
            

            {Array(size ).fill(null).map((item, index) => (
 <td key={`skeleton_${index}`} className="px-4 py-3">
 <div role="status" className="max-w-sm animate-pulse">
     <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
    
     <span className="sr-only">Loading...</span>
 </div>
</td>
            ))}
           

          
        </tr>
       </>
    )
}