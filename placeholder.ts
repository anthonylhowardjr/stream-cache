export class StreamCache<T> { 
  private _obs$: Observable<T>;
  private readonly _listener$$ = new Subject<T>();
  private readonly _reloader$$ = new Subject<void>();
  
  public refresh() {
    this._obs$ = null;
    this._reloader$$.next();
    this._listener$$.next({}); // Might not be needed here
  }
  
  private configureCache<T>(
    data: string,
    func: Observable<T>): Observable<T> {
    if (!this[`_${data}\$`]) {
      console.log('❌ - Cache Miss');
      this[`_${data}\$`] = func;

      this[`_${data}\$`].subscribe(x => {
        if (this[`_${data}Listener\$\$`]) {
          console.log('🧏🏾- Listener Updated', x);
          this[`_${data}Listener\$\$`].next(x)
        } else {
          console.log('🤦🏾‍♀️ - Listener Setup', x);
          this[`_${data}Listener\$\$`] = new BehaviorSubject<T>(x)
        }
      });
    }

    console.log('✔️ - Cache Hit');
    return this[`_${data}Listener\$\$`] ?? this[`_${data}\$`];
  }
}
