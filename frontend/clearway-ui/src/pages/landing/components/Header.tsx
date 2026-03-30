import { FaLinkedinIn } from 'react-icons/fa6'
import { ImGithub } from 'react-icons/im'
import { Link } from 'react-router-dom'
import  logo  from '../../../assets/img/logo-r.png'

export const Header = () => {
  return (
    <div  className='bg-[#1A1A1A] border-b border-red-900/50 fixed w-full z-199'>
      <header className="max-w-5xl mx-auto flex justify-between items-center px-6 md:px-16 py-5   ">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="logo"
            className="w-20 h-20"
          />
          <span className="text-xl font-bold text-red-500">
            Chuya Ñam
          </span>
        </div>
        <div className='w-full justify-center items-center text-lg hidden md:flex'>
          <nav>
            <ul className='flex gap-10'>
              <a href="#inicio" className='hover:bg-red-500/40 px-10 py-2 rounded-xl'> Inicio</a>
              <a href="#problem" className='hover:bg-red-500/40 px-10 py-2 rounded-xl'>Problema</a>
              <a href="#howWork" className='hover:bg-red-500/40 px-10 py-2 rounded-xl'>Como funciona</a>
            </ul>
          </nav>  
        </div>
        <div className="flex gap-5 text-2xl">
          <Link to="https://www.linkedin.com/in/eduardo-del-aguila-723988274/" target='_blank' className="hover:text-red-500 transition hover:scale-110">
            <FaLinkedinIn />
          </Link>
          <Link to="https://github.com/Eduardo-Del-Aguila" target='_blank' className="hover:text-red-500 transition hover:scale-110">
            <ImGithub/>
          </Link>
        </div>
      </header>
    </div>
  )
}
