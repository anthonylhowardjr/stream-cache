export class StreamCache<T> { 
  private _obs$: Observable<T>;
  private readonly _listener$$ = new Subject<T>();
  private readonly _reloader$$ = new Subject<void>();
  
  public refresh() {
    this._obs$ = null;
    this._reloader$$.next();
    this._listener$$.next({});
  }
  
  private configureCache<T>(
    data: string,
    func: Observable<T>,
    reloader$$: Subject<void>,
    listener?: Subject<T>): Observable<T> {
    if (!this[data]) {
      console.log('Cache miss', data, listener);
      this[data] = func;

      if (listener) {
        console.log('Getting Data', data);
        this[data].subscribe(x => listener.next(x));

        return listener;
      }
    }

    console.log('Cache hit', data);
    return listener || this[data];
  }
}
