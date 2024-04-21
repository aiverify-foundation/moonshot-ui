import MoonshotDesktop from './views/moonshot-desktop';
import QuickstartHome from './views/quickstart-home';

export default function Page() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-moonwine-950 to-moonwine-800">
      <div className="dust-overlay" />
      <QuickstartHome />
    </div>
  );
}
