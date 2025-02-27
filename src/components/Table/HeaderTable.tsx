'use client'

import React from "react";
import { ConfigButton } from "@/interface/ui";

interface Props {
    title: string;
    count: number;
    addButtonConfig?: ConfigButton;
    rightContent?: React.ReactNode;
    bottomContent?: React.ReactNode;
    isLoading?: boolean;
}

export default function HeaderTable({  bottomContent, title, count, addButtonConfig = {showButton: false, label:"", onClick: () => {}}, isLoading = false, rightContent }: Props) {

 
    return (
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 border-b dark:border-gray-700">
        <div className="w-full ">
           <div className="flex items-center space-x-3">
            <h5 className="dark:text-white font-semibold">{title}</h5>
            <div className="text-gray-400 font-medium">{count} resultados</div>
            {isLoading ? (
               <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">Guardando</div>

            ) : null}
           
           </div>
           {bottomContent !== undefined ? (
              <div className="mt-4">
                {bottomContent}
              </div>
           ) : null}
         
        </div>
        <div className="w-full flex flex-row items-center justify-end space-x-3">
          {addButtonConfig.showButton ? (
               <button onClick={addButtonConfig.onClick} type="button" className="w-full md:w-auto flex items-center justify-center py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
               <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                 <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
             </svg>
             {addButtonConfig.label}
         </button>
          ) : null}
           
           <>
           {rightContent}
           </>
        </div>
    </div>
    )
}