<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserProfileRequest;
use App\Http\Requests\UpdateUserSecurityRequest;
use App\Models\Payment;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\CancelSubscriptionMail;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    //show the index page
    public function index(Request $request)
    {
        return view('profile.profile', ['user' => $request->user(), 'page' => __('Basic Information'), 'route' => 'basic']);
    }

    //update profile
    public function updateProfile(UpdateUserProfileRequest $request)
    {
        if (isDemoMode()) return back()->with('error', __('This feature is not available in demo mode'));

        $request->user()->username = $request->username;
        $request->user()->email = $request->email;
        $request->user()->save();

        return back()->with('success', __('Settings saved.'));
    }

    //show the security page
    public function security(Request $request)
    {
        return view('profile.security', ['user' => $request->user(), 'page' => __('Security'), 'route' => 'security']);
    }

    //update security
    public function updateSecurity(UpdateUserSecurityRequest $request)
    {
        if (isDemoMode()) return back()->with('error', __('This feature is not available in demo mode'));

        $request->user()->password = Hash::make($request->input('password'));
        $request->user()->save();

        Auth::logoutOtherDevices($request->input('password'));

        return back()->with('success', __('Settings saved.'));
    }

    //show the plan page
    public function myPlan(Request $request)
    {
        return view('profile.plan', ['user' => $request->user(), 'page' => __('Plan'), 'route' => 'plan']);
    }

    //cancel plan
    public function cancelPlan(Request $request)
    {
        $request->user()->planSubscriptionCancel();

        try {
            Mail::to($request->user()->email)->send(new CancelSubscriptionMail($request->user()));
        } catch (\Exception $e) {
        }
        return back()->with('success', __('Settings saved.'));
    }

    //show the payments page
    public function payments(Request $request)
    {
        $payments = Payment::where('user_id', '=', $request->user()->id)
            ->orderBy('id', 'DESC')->paginate(config('app.pagination'));

        $plans = Plan::where([['amount_month', '>', 0], ['amount_year', '>', 0]])->withTrashed()->get();

        return view('profile.payments.index', ['payments' => $payments, 'plans' => $plans, 'page' => __('Payments'), 'route' => 'payments']);
    }

    //API token
    public function api(Request $request)
    {
        $user = $request->user();

        if (!$user->api_token) {
            $user->api_token = Str::random(60);
            $user->save();
        }

        return view('profile.api', ['api_token' => $user->api_token, 'page' => __('API Token'), 'route' => 'api']);
    }
}
