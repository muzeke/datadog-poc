import { tracer as defaultTracer } from "dd-trace";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

import { defaultDDtracerRoutes } from "./plain";

export const integrateRoutes = (router: Router) => {
  //integrate dd trace routes
  defaultDDtracerRoutes(router);
  //invalid routes
  router.use((req: Request, res: Response) => {
    res.status(StatusCodes.NOT_FOUND).json({
      error: "Invalid route",
      message: `You are trying to invoke an invalid api : ${req.url}`,
    });
  });
};
