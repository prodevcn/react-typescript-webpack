import React from 'react'
import './styles.css'
import ReactLogo from './react.png'
import Logo from './logo.svg'

const App = () => {
  return (
    <div>
      <h1>Basic react application with TypeScript and Webpack.</h1>
      <img src={ReactLogo} alt="React Logo" width={200} height={200} />
      <img src={Logo} alt="Logo" width={200} height={200} />
    </div>
  )
}
export default App
