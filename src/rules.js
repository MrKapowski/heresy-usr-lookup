export default () => ({
  rules: [],
  loading: false,
  sources: ['/rules.json'],
  search: '',
  term: null,
  error: '',
  results() {
    return this.search !== ''
      ? this.rules.filter((rule) =>
          rule.name.toLowerCase().includes(this.search.toLowerCase()),
        ).length
      : 0;
  },
  get(source) {
    this.loading = true;
    // eslint-disable-next-line compat/compat
    fetch(source)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.loading = false;
        this.rules = [].concat(
          data.sort((first, second) => {
            return first.name < second.name
              ? -1
              : first.name > second.name
              ? 1
              : 0;
          }),
        );
        return true;
      })
      .catch((error) => {
        this.error = error.message;
      });
  },
  init() {
    this.sources.forEach((source) => {
      this.get(source);
    });
  },
});
