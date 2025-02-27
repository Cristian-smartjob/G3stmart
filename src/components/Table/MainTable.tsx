'use client'

import React from "react";
import FooterTable from "./FooterTable";
import { CheckboxStatus, ConfigButton } from "@/interface/ui";
import HeaderTable from "./HeaderTable";
import EmptyTable from "./EmptyTable";

interface Props {
    children: React.ReactNode;
    header: string[];
    title: string;
    count: number;
    addButtonConfig?: ConfigButton;
    showCheckbox?: boolean;
    checkboxStatus?: CheckboxStatus;
    onChangeSelectAll: (value: CheckboxStatus) => void;
    rightContent?: React.ReactNode;
    bottomContent?: React.ReactNode;
    emptyTitle?: string;
    isEmpty?: boolean;
    onClickEmpty?: () => void;
    onSelectPage?: (page: number) => void;
    page: number;
    onNext: () => void;
    onPrev: () => void;
    isLoading?: boolean;
}

export default function MainTable({ 
    children, 
    header, 
    title, 
    count, 
    addButtonConfig = {showButton: false, label:"", onClick: () => {}},
    showCheckbox = true,
    checkboxStatus = CheckboxStatus.Off,
    onChangeSelectAll,
    rightContent,
    bottomContent,
    emptyTitle,
    isEmpty = false,
    onClickEmpty,
    onSelectPage,
    page,
    onNext,
    onPrev,
    isLoading = false
}: Props) {

 
    return (
        <section className="h-screen bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
  <div className="mx-auto max-w-screen-2xl px-4 lg:px-12">

      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <HeaderTable 
            title={title}
            count={count}
            addButtonConfig={addButtonConfig}
            rightContent={rightContent}
            bottomContent={bottomContent}
            isLoading={isLoading}
          />
            <div>
            
          {/*<div className="overflow-x-auto">*/}
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                      <tr>

                        {showCheckbox ? (
                                <th scope="col" className="p-4">
                                <div className="flex items-center">
                                    <input id="checkbox-all" type="checkbox" value={checkboxStatus} checked={checkboxStatus===CheckboxStatus.On} onChange={value => {
                                        
                                        if(value.target.value === CheckboxStatus.Off){
                                            onChangeSelectAll(CheckboxStatus.On)
                                        } else {
                                            onChangeSelectAll(CheckboxStatus.Off)
                                        }
                                    }} 
                                    className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label className="sr-only">checkbox</label>
                                </div>
                            </th>
                        ) : null}
                         

                          {header.map(item => (
                             <th key={item} scope="col" className="px-4 py-3 min-w-[10rem]">
                             {item}
                             <svg className="h-4 w-4 ml-1 inline-block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                 <path clipRule="evenodd" fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" />
                             </svg>
                         </th>
                          ))}
                      </tr>
                  </thead>
                  <tbody data-accordion="table-column">
                    {children}
                  </tbody>
                  
              </table>
          </div>
          {isEmpty ? (
               <div className="w-full">
               <EmptyTable
                   title={emptyTitle || ""}
                   onClick={onClickEmpty}
               />
             </div>
          ) : null}
       
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 px-4 pt-3 pb-4" aria-label="Table navigation">
              <FooterTable 
                page={page}
                count={count} 
                onPress={(page: number) => {
                    if(onSelectPage !== undefined){
                        onSelectPage(page)
                    }
                }} 
                onNext={onNext}
                onPrev={onPrev}    
            />
          </div>
      </div>
  </div>
</section>
    )
}