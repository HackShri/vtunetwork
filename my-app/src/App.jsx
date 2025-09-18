import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AuthMiddleWare } from './Redux/AuthStore/index.js'

import Header from './components/Header.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/Login.jsx'
import Successpage from './Successpage.jsx'
import Register from './pages/Register.jsx'
import Checkauth from './pages/CheckAuth/Checkauth.jsx'
import PublicOnlyRoute from './pages/CheckAuth/PublicOnlyRoute.jsx'
import Profile from './pages/userProfile/Profile.jsx'
import NotesPage from './pages/Notesgallery/NotesPdfviewer.jsx'
import PDFPreviewPage from './pages/Notesgallery/pdfPreview.jsx'
import PDFList from './pages/Notesgallery/groupUploadsviewer.jsx'
import Adminnotes from './pages/Notesgallery/Adminnotes.jsx'
import PDFUploadDialog from './pages/userProfile/FileUpload.jsx'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(AuthMiddleWare())
  }, [])

  return (
    <div>
      <Header />
      <Routes>

        {/* 🔓 Public Routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/success' element={<Successpage />} />

        {/* 🔐 Login/Register => Block if already logged in */}
        
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<Register />} />
        

        {/* 🔐 Protected Routes */}
          <Route path='/adminnotes' element={<Adminnotes />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/notes' element={<NotesPage />} />
          <Route path='/previewpath/:id' element={<PDFPreviewPage />} />
          <Route path='/groupupload/:id' element={<PDFList />} />
          <Route path='/uploads' element={<PDFUploadDialog />} />
        

      </Routes>
    </div>
  )
}

export default App

{/*  */ }

