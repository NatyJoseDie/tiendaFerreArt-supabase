export function Footer() {
  return (
    <footer className="border-t py-8 mt-12">
      <div className="container text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AB Mayorista. Todos los derechos reservados.</p>
        <p className="mt-1">Desarrollado con Next.js y ShadCN UI.</p>
      </div>
    </footer>
  );
}
