import React from 'react'

export default function Loading() {
    return (
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center'>
            <div className='flex flex-col items-center pb-4'>
            <img src='/loading.gif' alt='loading' className='w-16 h-16' />
                Loading...
            </div>
        </div>
    )
}
