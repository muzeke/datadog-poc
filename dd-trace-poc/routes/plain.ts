import { tracer as defaultTracer } from 'dd-trace';
import { Request, Response, Router } from 'express';

export const defaultDDtracerRoutes = (router: Router) => {
  router.get('/trace-example-1', (_req: Request, res: Response) => {
    //init
    const tracer = defaultTracer.init();
    const span = tracer.scope().active();
    if (span) {
      span.setTag('foo', 'bar');
      span.addTags({
        foo: 'bar',
        baz: 'qux',
      });
    }

    span?.log({
      message: 'example log from /trace-example-1',
    });

    res.json({ message: 'Trace example 1' });
  });

  router.get('/trace-example-2', (_req: Request, res: Response) => {
    const tracer = defaultTracer.init();
    const span = tracer.scope().active();
    if (span) {
      span.setTag('customer_id', '123456');
    }

    span?.log({
      message: 'example log from /trace-example-2',
    });

    res.json({ message: 'Trace example 2' });
  });

  router.get('/trace-example-3', (_req: Request, res: Response) => {
    const tracer = defaultTracer.init({ logInjection: true });
    tracer.trace(
      'hello.world',
      {
        service: 'TraceExample3Service',
        resource: 'TraceExample3Resource',
        tags: {
          user: {
            name: 'Zeke',
            title: 'Devops',
          },
        },
      },
      (span) => {
        span?.log({
          message: 'example log from /trace-example-3',
        });

        // Add a log to the span
        span?.log({
          message: 'NEW ',
          user_id: '123',
        });

        span?.addTags({ error: true });

        span?.log({
          event: 'error',
          message: 'An error message here',
        });

        console.log('Hello, World!');
      }
    );

    res.json({ message: 'Trace example 3' });
  });

  router.get('/trace-example-4', async (_req, res) => {
    const tracer = defaultTracer.init();

    const span = tracer.startSpan('plaintrace.http.request');
    span.setTag('resource.name', '/api/plain-trace');
    span.setTag('span.type', 'web');
    // code being traced

    span.finish();

    res.json({ message: 'using dd-trace plain tracing' });
  });

  router.get('/trace-example-5', async (_req, res) => {
    const tracer = defaultTracer.init();

    // submit a custom span named "sleep"
    const sleep = tracer.wrap('sleep', (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    });

    await sleep(100);

    res.json({ message: 'trace example 5' });
  });

  router.get('/trace-example-6', async (_req, _res) => {
    const tracer = defaultTracer.init();
    const span = tracer.scope().active();
    try {
      if (span) {
        span.setTag('customer_id', '123456');
      }

      throw new Error('An error occured!!!');
    } catch (error: any) {
      span?.addTags({ error: true });
      span?.log({
        message: 'An error occurred',
        error,
      });
      // span?.log({
      //   event: 'error',
      //   'error.object': error,
      //   message: error.message,
      // });
    }
  });

  router.get('/trace-example-7', (_req, res) => {
    const tracer = defaultTracer.init();
    const span = tracer.scope().active();
    span?.log({ error: 'test' });
    throw new Error('Something went wrong!');
  });
};
