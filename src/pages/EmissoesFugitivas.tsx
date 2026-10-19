import { Guide } from '@/components/Guide';
import type { GuideData } from '@/lib/guide';
import guide from '../../content/emissoes-fugitivas-guia.json';

// The page for the head term "emissões fugitivas": definition, sources, LDAR, the Rio de Janeiro rules and every article of the topic.
export default function EmissoesFugitivas() {
  return <Guide data={guide as unknown as GuideData} />;
}
