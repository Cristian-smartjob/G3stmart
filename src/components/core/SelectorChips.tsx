import { ComboBoxItem } from "@/interface/ui";


interface Props {
    items: ComboBoxItem[];
    onClose: (item: ComboBoxItem) => void;
}
export default function SelectorChips({ items, onClose }: Props){
    return (

        <div className=" gap-2">
            {items.map(item => (
                <span key={item.id} id="badge-dismiss-default" className="inline-flex mt-2 items-center px-2 py-1 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">
                {item.label}
                <button onClick={() => {
                    onClose(item)
                }} type="button" className="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300" data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                <svg className="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Remove badge</span>
                </button>
                </span>
            ))}
        </div>

    )
}