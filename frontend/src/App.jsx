import { useEffect } from 'react'
import Home from './pages/Home'
import BananaBackground from './components/BananaBackground'

function App() {
    useEffect(() => {
        // Always use dark mode
        document.body.classList.add('dark')
    }, [])

    return (
        <div className="min-h-screen dark">
            <BananaBackground />
            <Home />
        </div>
    )
}

export default App
