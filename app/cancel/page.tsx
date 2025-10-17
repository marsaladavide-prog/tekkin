export default function CancelPage(){
  return (
    <div className="card" style={{ textAlign:"center" }}>
      <h1 className="gradText" style={{ fontSize:28 }}>Pagamento annullato</h1>
      <p>Nessun addebito. Puoi riprovare quando vuoi.</p>
      <a className="btn" href="/">Torna alla Home</a>
    </div>
  );
}
