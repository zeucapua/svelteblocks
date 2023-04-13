export async function load({ locals }) {
  const session = await locals.getSession();
  console.log({ session });
  return { session };
}
