import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


logger = logging.getLogger(__name__)


async def global_exception_handler(
    request: Request,
    exception: Exception
):
    logger.exception(
        "Unhandled exception occurred: %s %s",
        request.method,
        request.url.path
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected server error occurred."
            }
        }
    )


def register_exception_handlers(app: FastAPI):
    app.add_exception_handler(
        Exception,
        global_exception_handler
    )
