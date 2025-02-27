interface Props {
    progress: number;
}
export default function ProgressBar({ progress }: Props){
    return (
        <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
        <div 
            className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            style={{
                width: `${progress}%`,
                transition: 'width 0.3s linear'  // Animación del ancho
            }}
        >
            {progress.toFixed(2)}%
        </div>
    </div>
    
    )
}