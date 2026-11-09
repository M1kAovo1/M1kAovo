#include<bits/stdc++.h>
using ll = long long; using db = double; using ldb = long double; using _i = __int128; using namespace std; 
#define For(i, a, n, x) for(int i=a; i<=n; i+=x)
#define foR(i, n, a, x) for(int i=n; i>=a; i-=x)
#define pc(x) __builtin_popcount(x)
#define ctz(x) __builtin_ctz(x)
#define sz(a) (int)a.size()
const ll P = 1e9+7; const ll G = 3;
ll Norm(ll x){ x %= P; if(x < 0) x += P; return x; }
ll mul(ll a, ll b){ return (_i)a * b % P; }
ll ksm(ll a, ll b){ ll res = 1; while(b) {if(b & 1) res = mul(res, a); a = mul(a, a); b >>= 1;} return res; }
// const int N = 2e5+10; ll fac[N+1], ifac[N+1];
// void init(){
//     fac[0] = 1; For(i, 1, N, 1) fac[i] = mul(fac[i-1], i);
//     ifac[N] = ksm(fac[N], P-2); foR(i, N, 1, 1) ifac[i-1] = mul(ifac[i], i);
// }
// ll C(int n, int k) { if(k < 0 || k > n) return 0; return mul(fac[n], mul(ifac[k], ifac[n-k])); }
// cout << 2.0 * N * sizeof(ll) / (1024 * 1024) << " MiB\n";
vector<ll> a, L, R;
ll T;
int n;

void dfs(int l, int r, ll sum, vector<ll> &v){
    if(sum > T) return;
    if(l > r){
        v.push_back(sum);
        return;
    }

    dfs(l+1, r, sum, v);
    dfs(l+1, r, sum+a[l], v);
}
void ovo(){
    cin >> n >> T;
    a.resize(n+1);
    For(i, 1, n, 1) cin >> a[i];
    int mid = n / 2;

    dfs(1, mid, 0, L);
    dfs(mid+1, n, 0, R);

    sort(R.begin(), R.end());

    ll ans = 0;
    for(ll x : L){
        auto it = upper_bound(R.begin(), R.end(), T-x);
        if(it == R.begin()) continue;
        --it;
        ans = max(ans, x + *it);
    }
    cout << ans << '\n';
}
int main(){
	ios::sync_with_stdio(false); cin.tie(nullptr); int t = 1; // cin >> t;
    while(t--) ovo(); return 0;
}
