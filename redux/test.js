db.updateUser(
  "root",
  {
    pwd: "root",
    roles: [
      { role: "userAdminAnyDatabase", db: "admin" },
      { role: "userAdminAnyDatabase", db: "fullstack" }
    ]
  }
);
