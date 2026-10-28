import Showroom from '../components/Showroom.jsx';
import { useSite } from '../lib/site.jsx';

/** The cinematic entrance. Copy comes from the editable hero section. */
export default function Hero() {
  const { section, visible } = useSite();
  if (!visible('hero')) return null;
  return <Showroom hero={section('hero')} />;
}
