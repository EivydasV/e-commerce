export interface MapperInterface<T, K> {
  transform(data: T): Promise<K> | K;
}
