/**
 * Bind all object functions with current instance. Used in middleware classes
 * such that when its member methods are called by reference, they behave the
 * same as if they are class methods
 * @param {*} target
 */
export const autoBind = (target) => {
  const thisPrototype = Object.getPrototypeOf(target);
  const propNames = Object.getOwnPropertyNames(thisPrototype);

  for (const propName of propNames) {
    if (typeof target[propName] !== 'function') continue;
    target[propName] = target[propName].bind(target);
  }
};