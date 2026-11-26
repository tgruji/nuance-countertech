import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Network } from './pages/Network';
import { Profile } from './pages/Profile';
import { Messaging } from './pages/Messaging';
import { Notifications } from './pages/Notifications';
import { About } from './pages/About';
import { useApp } from './store/AppContext';

export type Route =
  | { page: 'home' }
  | { page: 'network' }
  | { page: 'messaging' }
  | { page: 'notifications' }
  | { page: 'about' }
  | { page: 'profile'; id: string };

// A tiny hash router: #/, #/network, #/profile/p1, ...
function parseHash(hash: string): Route {
  const [, page = '', id] = hash.replace(/^#/, '').split('/');
  switch (page) {
    case 'network':
    case 'messaging':
    case 'notifications':
    case 'about':
      return { page };
    case 'profile':
      return { page: 'profile', id: id ?? 'me' };
    default:
      return { page: 'home' };
  }
}

function useHashRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export default function App() {
  const route = useHashRoute();
  const { resetCount } = useApp();

  return (
    <>
      <Navbar route={route} />
      <div key={resetCount} className="mx-auto max-w-[1128px] px-4 py-6">
        {route.page === 'home' && <Home />}
        {route.page === 'network' && <Network />}
        {route.page === 'messaging' && <Messaging />}
        {route.page === 'notifications' && <Notifications />}
        {route.page === 'about' && <About />}
        {route.page === 'profile' && <Profile key={route.id} id={route.id} />}
      </div>
    </>
  );
}
