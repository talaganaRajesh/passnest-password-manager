import React from 'react'
import { MagicCard } from './ui/magic-card'
import { useTheme } from 'next-themes'
import eyecross from '../assets/eye-slash-solid.svg'
import eye from '../assets/eye-solid.svg'
import { useRef } from 'react'
import { useState, useEffect } from 'react'
import copyicon from '../assets/copy.png'
import { v4 as uuidv4 } from 'uuid';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';


function Manager() {

    const ref = useRef()
    const passref = useRef()
    const [showTooltip, setShowTooltip] = useState(false);

    const [form, setForm] = useState({ site: "", mail: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

    useEffect(() => {
        let passwords = localStorage.getItem('passwords')
        if (passwords) {
            setPasswordArray(JSON.parse(passwords))
        }

    }, [])

    useEffect(() => {
        document.querySelector('input[type="text"]:first-child').focus();

    }, []);



    function showPassword() {
        // passref.current.type="text"
        if (ref.current.src.includes(eyecross)) {
            ref.current.src = eye;
            passref.current.type = "text"
        }
        else {
            ref.current.src = eyecross;
            passref.current.type = "password"
        }

 
        
    }


    const savePassword = () => {
        const updatedPasswords = [...passwordArray, {...form,id:uuidv4()}];
        setPasswordArray(updatedPasswords);
        localStorage.setItem('passwords', JSON.stringify(updatedPasswords));

        setForm({site:'',mail:'',password:''})

        toast('password saved', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    const deletePassword = (id) => {
        const c=confirm("Are you sure , you want to delet this password?")

        if(c){
            const updatedPasswords=passwordArray.filter(item=>item.id!==id);
            setPasswordArray(updatedPasswords);
            localStorage.setItem('passwords',JSON.stringify(updatedPasswords));
        }


    }

    const editPassword = (id) => {
        setForm(passwordArray.filter(item=>item.id===id)[0]);
        setPasswordArray(passwordArray.filter(item=>item.id!==id));
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const copyText = (text) => () => {
        navigator.clipboard.writeText(text)
        toast('text copied', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }



    const { theme } = useTheme();
    return (
        <div className="bg-gradient-to-r from-green-50 to-cyan-50">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className='flex justify-center'>
                <MagicCard
                    className="cursor-pointer bg-green-100 p-10 mt-10 rounded-lg w-1/2 shadow-2xl"
                    gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                >
                    <h1 className='text-center mb-7 text-black font-semibold text-lg'>Store a new <span className='text-green-600 font-bold'>password</span></h1>

                    <div className='flex flex-col px-32 gap-1'>
                        <input value={form.site} name='site' onChange={handleChange} type="text" className='bg-white mb-3 border-2 border-green-200 px-3 py-2 rounded-lg' placeholder='Enter the website name or URL' />
                        <input value={form.mail} name='mail' onChange={handleChange} type="text" className=' bg-white mb-3 border-2 border-green-200 px-3 py-2 rounded-lg' placeholder='Enter the mail or user id' />
                        <div className='relative mb-3'>
                            <input ref={passref} value={form.password} name='password' onChange={handleChange} type="password" className='bg-white border-2 border-green-200 px-3 py-2 rounded-lg pr-10 w-full' placeholder='Enter the password' />
                            <img ref={ref} src={eyecross} onClick={showPassword} alt="Toggle Password Visibility" className='absolute right-3 top-1/2 h-5 opacity-90 transform -translate-y-1/2 cursor-pointer' />
                        </div>

                        <button onClick={savePassword} className='bg-green-600 text-white px-3 py-2 mt-5 rounded-lg'>
                            <div className='flex justify-center'>
                                <lord-icon
                                    src="https://cdn.lordicon.com/fjvfsqea.json"
                                    trigger="loop"
                                    stroke="bold"
                                    colors="primary:#121331,secondary:#ffffff"
                                >
                                </lord-icon>
                                <h1 className='text-center pl-2 mt-1 font-bold text-black text-lg'>Save Password</h1>
                            </div>
                        </button>
                    </div>
                </MagicCard>
            </div>


            <div className='passwords justify-center flex-col flex items-center mt-14'>
                <h2 className='text-center text-black font-semibold'>All your passwords</h2>
                {passwordArray.length === 0 && <div className='text-center text-gray-600 font-semibold bg-green-100 w-1/2 py-24 my-4'>No passwords stored yet</div>}

                {passwordArray.length !== 0 &&
                    <div className="w-3/4 overflow-x-auto">
                        <table className="min-w-full bg-green-100 mb-20 mt-5 rounded-lg">
                            <thead>
                                <tr>
                                    <th className='px-6 py-3'>Site</th>
                                    <th className='px-6 py-3'>Mail</th>
                                    <th className='px-6 py-3'>Password</th>
                                    <th className='px-6 py-3'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {passwordArray.map((item, index) => (
                                    <tr key={index}>
                                        <td className='border border-r-black border-t-black border-b-gray-400 px-10 py-4'>
                                            <div className='flex items-center justify-between '>
                                                <a href={`http://${item.site}`} target='blank' className="truncate mr-2 hover:text-blue-600 transition-colors duration-200">{item.site}</a>
                                                <img src={copyicon} alt="copy" onClick={copyText(item.site)} className='w-4 h-4 opacity-30 transition-opacity duration-300 hover:opacity-100 cursor-pointer flex-shrink-0' />
                                            </div>
                                        </td>
                                        <td className='border border-t-black border-r-black border-b-gray-400 px-6 py-4'>
                                            <div className='flex items-center justify-between'>
                                                <span className="truncate mr-2">{item.mail}</span>
                                                <img src={copyicon} alt="copy" onClick={copyText(item.mail)} className='w-4 h-4 opacity-30 transition-opacity duration-300 hover:opacity-100 cursor-pointer flex-shrink-0' />
                                            </div>
                                        </td>
                                        <td className='border border-t-black px-6 border-r-black border-b-gray-400 py-4'>
                                            <div className='flex items-center justify-between'>
                                                <span className="truncate mr-2">{item.password}</span>
                                                <img src={copyicon} alt="copy" onClick={copyText(item.password)} className='w-4 h-4 opacity-30 transition-opacity duration-300 hover:opacity-100 cursor-pointer flex-shrink-0' />
                                            </div>
                                        </td>
                                        <td className='border border-t-black px-6 border-b-gray-400 py-4'>
                                            <div className='flex justify-center gap-3 cursor-pointer'>
                                                <lord-icon
                                                    onClick={()=>{editPassword(item.id)}}
                                                    src="https://cdn.lordicon.com/exymduqj.json"
                                                    trigger="hover"
                                                >
                                                </lord-icon>
                                                <lord-icon
                                                    onClick={()=>{deletePassword(item.id)}}
                                                    src="https://cdn.lordicon.com/hwjcdycb.json"
                                                    trigger="hover"
                                                >
                                                </lord-icon>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
            </div>

            <div className='text-center pb-2'>
                <a href="https://talaganarajesh.vercel.app/"> <h1>Built with 💖 by <span className='font-bold text-green-600'>Rajesh</span></h1></a>
            </div>

        </div>
    )
}

export default Manager