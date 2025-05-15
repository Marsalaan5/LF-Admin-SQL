// Permission middleware that checks if a user has a specific permission for a module
export function checkPermission(moduleName, action) {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.permissions) {
      return res
        .status(403)
        .json({ message: "Forbidden: Permissions not found" });
    }

    const modulePermissions = user.permissions[moduleName];
    if (!modulePermissions || !modulePermissions[action]) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
}
