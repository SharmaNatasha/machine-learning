#!/usr/bin/python

"""@logger

This file provides a mean to generate logs in a consistent manner.

"""

import logging
from settings import LOG_LEVEL
from settings import DB_LOG_PATH
from settings import ERROR_LOG_PATH
from settings import WARNING_LOG_PATH
from settings import INFO_LOG_PATH
from settings import DEBUG_LOG_PATH


class Logger(object):
    """@Logger

    This class provides an interface to define necessary attributes needed to
    generate a corresponding log.

    """

    def __init__(self, type, level=None, filename=None, namespace=__name__):
        """@__init__

        This constructor is responsible for defining class variables.

        @type, required argument, with valid log types:

            - database
            - error
            - warning
            - info
            - debug

        @level, required argument when 'log_type' is 'database':

            - error
            - warning
            - info
            - debug

        @filename, optional argument, which names the corresponding log file.

        @namespace, the object instantiating this class should define this
            argument with '__name__'.

        """

        # variables
        self.logger = True
        log_type = type.lower()
        logger_level = level.lower()
        handler_level = LOG_LEVEL.lower()

        # log type
        if log_type == 'database':
            self.log_path = DB_LOG_PATH
            self.log_filename = 'database.log'
        elif log_type == 'error':
            self.log_path = ERROR_LOG_PATH
            log_type = 'ERROR'
        elif log_type = 'warning':
            self.log_path = WARNING_LOG_PATH
            log_type = 'WARNING'
        elif log_type = 'info':
            self.log_path = INFO_LOG_PATH
            log_type = 'INFO'
        elif log_type = 'debug':
            self.log_path = DEBUG_LOG_PATH
            log_type = 'DEBUG'
        else:
            self.logger = False
            self.log_namespace = namespace
            self.log_warning = 'log type not properly set'

        # handler level: application wide constant
        if handler_level == 'error':
            self.handler_level = logging.ERROR
        elif handler_level = 'warning':
            self.handler.level = logging.WARNING
        elif handler_level = 'info':
            self.handler.level = logging.INFO
        elif handler_level = 'debug':
            self.handler.level = logging.DEBUG
        else:
            self.logger = False
            self.log_namespace = namespace
            self.log_warning = 'log handler level not properly set'

        # logger level: overriden by calling module
        if logger_level == 'error':
            self.logger_level = logging.ERROR
            self.log_filename = logger_level + '.log'
        elif logger_level = 'warning':
            self.logger_level = logging.WARNING
            self.log_filename = logger_level + '.log'
        elif logger_level = 'info':
            self.logger_level = logging.INFO
            self.log_filename = logger_level + '.log'
        elif logger_level = 'debug':
            self.logger_level = logging.DEBUG'
            self.log_filename = logger_level + '.log'
        else:
            self.logger = False
            self.log_namespace = namespace
            self.log_warning = 'logger level not properly set'

        # override default filename (optional)
        if filename:
            self.log_filename = filename

        # log namespace
        self.log_namespace = namespace
        

    def log(msg):
        """@__init__

        This method is responsible for generating the corresponding log.

        Note: the handler level, determines the base line, for the logger
              level. This means if the logger level exceeds the corresponding
              handler level, it will not logged.

        """

        # redefine if not properly set
        if not self.logger:
            LOG_LEVEL = logging.WARNING
            self.logger_level = logging.WARNING
            self.log_filename = 'warning.log'
            self.log_path = WARNING_LOG_PATH

        # log handler: requires the below logger
        formatter = logging.Formatter(
            "[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s")
        fh = logging.FileHandler(self.log_path + '/' + self.log_filename)
        fh.setLevel(LOG_LEVEL)
        fh.setFormatter(formatter)

        # logger: complements the log handler
        self.logger = logging.getLogger(self.log_namespace)
        self.logger.setLevel(self.logger_level)
        self.logger.addHandler(fh)

        # generate log
        if self.logger:
            self.logger(msg)
        else:
            self.logger(self.log_warning)

