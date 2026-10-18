import topics from '../../content/topics.json';
export const topicLabels: Record<string,string> = Object.fromEntries(topics.map(t=>[t.id,t.label]));
export const topicPaths: Record<string,string> = Object.fromEntries(topics.map(t=>[t.id,t.slug]));
