const getStorageKey = (userId: string): string => {
  return `financeiro_payment_methods_${userId}`;
};

const DEFAULT_METHODS = ['Pix', 'Cartão Santander', 'Dinheiro', 'Outro'];

export const loadPaymentMethods = (userId: string): string[] => {
  const key = getStorageKey(userId);
  const data = localStorage.getItem(key);
  if (!data) {
    // Se não existir, salva os métodos padrão
    savePaymentMethods(DEFAULT_METHODS, userId);
    return DEFAULT_METHODS;
  }

  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_METHODS;
  }
};

export const savePaymentMethods = (methods: string[], userId: string): void => {
  const key = getStorageKey(userId);
  localStorage.setItem(key, JSON.stringify(methods));
};

export const addPaymentMethod = (method: string, userId: string): string[] => {
  const methods = loadPaymentMethods(userId);
  if (!methods.includes(method)) {
    methods.push(method);
    savePaymentMethods(methods, userId);
  }
  return methods;
};

export const deletePaymentMethod = (method: string, userId: string): string[] => {
  const methods = loadPaymentMethods(userId);
  const filtered = methods.filter((m) => m !== method);
  savePaymentMethods(filtered, userId);
  return filtered;
};

export const updatePaymentMethod = (
  oldMethod: string,
  newMethod: string,
  userId: string
): string[] => {
  const methods = loadPaymentMethods(userId);
  const index = methods.indexOf(oldMethod);
  if (index !== -1) {
    methods[index] = newMethod;
    savePaymentMethods(methods, userId);
  }
  return methods;
};
