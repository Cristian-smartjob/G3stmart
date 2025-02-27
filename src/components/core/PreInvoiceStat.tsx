'use client'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

interface Props {
    statIdx: number;
    name: string;
    value: string;
}

export default function PreInvoceStat({ statIdx, name, value }: Props) {


  return (
    <div
       
        className={classNames(
        statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '',
        'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8',
        )}
    >
        <dt className="text-sm/6 font-medium text-gray-500">{name}</dt>
        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">
        {value}
        </dd>
    </div>
  )
}
