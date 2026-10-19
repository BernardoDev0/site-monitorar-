import { Guide } from '@/components/Guide';
import type { GuideData } from '@/lib/guide';
import guide from '../../content/consultoria-ambiental-guia.json';

// The page for the head terms "consultoria ambiental" and "empresa de engenharia ambiental": what it is, licences, how to choose, who the company is.
export default function ConsultoriaAmbiental() {
  return <Guide data={guide as unknown as GuideData} />;
}
