import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { Home } from './pages/Home/Home';
import { Posts } from './pages/Posts/Posts';
import { Users } from './pages/Users/Users';
import { Container } from '@mui/material';

function App() {
  return (
    <Router>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;