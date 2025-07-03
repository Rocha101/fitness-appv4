module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [2, "always", 300],
    "subject-case": [0],
    "subject-full-stop": [0],
  },
};
