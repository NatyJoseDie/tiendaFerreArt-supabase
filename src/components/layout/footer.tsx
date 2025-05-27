export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ShopVision. All rights reserved.</p>
        <p className="mt-1">Built with Next.js and ShadCN UI.</p>
      </div>
    </footer>
  );
}
