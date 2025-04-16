interface CreateAdminParams {
  email: string;
  password: string;
  name: string;
}

export const createAdmin = async (params: CreateAdminParams) => {
  try {
    const response = await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create admin");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
