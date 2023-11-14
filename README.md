# Kanban App

> An offline kanban application built with React, Redux, TailwindCSS, and HeadlessUI, powered by Service Workers and IndexedDB.

> [Live Application ->](https://kanban-app-tan.vercel.app/).

## List of Key Dependencies & Tools

- [React](https://reactjs.org/) with [Jest](https://jestjs.io/)
- [Redux Toolkit Query](https://redux-toolkit.js.org/tutorials/rtk-query)
- [TailwindCSS](https://tailwindcss.com/) & [TailwindUI](https://tailwindui.com/)
- [HeadlessUI](https://headlessui.com/)
- [Mock Service Workers (MSW)](https://mswjs.io/docs/)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (browser API)

This kanban application was built as a learning exercise for Redux, MSW and IndexedDB, as well as frontend implementation in general. It works offline using service workers with MSW which accesses the IndexedDB API directly in the browser and persists the storage through sessions. **The application UI design was supplied by [Frontend Mentor](https://www.frontendmentor.io/).**

## Redux, RTKQ, & react-beautiful-dnd

This application uses Redux for state and cache management through the [Redux Toolkit Query API](https://redux-toolkit.js.org/tutorials/rtk-query). Before any change is fully updated in the database, RTKQ optimistically updates the state, then calls the database for the updated information behind the scenes. If there happens to be any error, RTKQ will also undo the state changes, and proceed to fetch the correct data from the database. All requests made are cached in the RTKQ store to avoid redundant requests. Even though the HTTP requests are intercepted by MSW and stored in IDB, the decision to cache responses was made because of future intentions of creating a backend API for this application.

This application also has a drag-and-drop feature for columns, tasks, and subtasks. This feature is built with [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd).

## TailwindCSS, TailwindUI && HeadlessUI

The project was started with template components from Tailwind UI, which has built-in accessibility (aria) labels, uses proper semantic elements, and uses HeadlessUI out of the box. Further custom styles were then applied with tailwind CSS.

## MSW and IndexedDB

Initially, this was going to be a full-stack project, with a backend rest API that manages a database, hence the decision to use MSW. Service Workers are available in all common browsers and are a great way to test application features that make external requests. They work by intercepting HTTP requests and responding with mock data (user defined), bypassing the need to make a request that could fail for several uncontrollable reasons. IndexedDB is globally available to service workers and is accessed at the top level of the MSW implementation to maintain data for the application in the in-browser storage.

> The front end was initially built using `mswjs/data`, which features an _in-memory_ database API, and React's state provider feature using the `useContext` hook was going to be the state management method. I later decided to use Redux with RTKQ as well as hold off on building a backend for simplicities sake. Since the service worker logic was pretty much entirely built out, I decided to remove the in-memory store and go with a more permanent in-browser storage solution, hence IndexedDB.

Using service workers in tandem with IndexedDB adds another level of complexity that isn't entirely necessary, considering it would be possible to access IndexedDB without MSW. The advantage of using MSW will be the ability to toggle offline and online mode, as well as persist data to a backend even with an intermittent internet reception, once a backend API is built. The only caveat is the backend API has to be *exactly* the same as the MSW implementation, or else things will break.
