import { index, route } from "@react-router/dev/routes";
export default [
    index("routes/_index.tsx"),
    route("projects/:slug", "routes/projects.$slug.tsx"),
];
