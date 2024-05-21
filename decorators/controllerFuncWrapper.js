const controllerFuncWrapper = (controllerFunc) => {
  return async (req, res, next) => {
    try {
      await controllerFunc(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default controllerFuncWrapper;
