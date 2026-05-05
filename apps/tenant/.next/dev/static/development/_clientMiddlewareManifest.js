self.__MIDDLEWARE_MATCHERS = [
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|favicon.ico|icons\\/).*))(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/((?!_next/static|_next/image|favicon.ico|icons/).*)"
  }
];self.__MIDDLEWARE_MATCHERS_CB && self.__MIDDLEWARE_MATCHERS_CB()