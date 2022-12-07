export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function openModalFunction(stateName: string) {
  return (state: any, { payload }: { payload: { open: boolean } }) => {
    const { open } = payload;
    state[stateName] = open;
  };
}
