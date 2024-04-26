export interface ElasticsearchModelInterface<T> {
  count: number;
  maxScore?: number | null;
  hits: Hits<T>[];
}

export interface Hits<T> {
  _index: string;
  _id: string;
  _score?: number | null;
  _source?: T;
}
