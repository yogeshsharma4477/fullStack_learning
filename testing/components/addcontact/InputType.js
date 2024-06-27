import React from 'react'

const InputType = ({ label }) => {
    return (
        <div className='inputwrap mt-20'>
            <input className='input' type='text' required />
            <label className='input__label'>{label}</label>
        </div>

    )
}

export default InputType
