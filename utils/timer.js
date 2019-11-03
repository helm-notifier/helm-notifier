function stop(time) {
  const duration = process.hrtime(time);
  const nanoseconds = (duration[0] * 1e9) + duration[1];
  const milliseconds = nanoseconds / 1e6;
  const seconds = nanoseconds / 1e9;

  return {
    seconds,
    milliseconds,
    nanoseconds,
  };
}

function timer() {
  const time = process.hrtime();

  return {
    stop: () => stop(time),
  };
}

module.exports = timer;
